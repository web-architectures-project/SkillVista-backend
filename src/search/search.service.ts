import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SearchService {
  // Initate prisma
  prisma = new PrismaClient();
  natural = require('natural');

  async search(input: string = '') {
    // First normalise input, trim and lowercase
    input = input
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9 ]/g, '');

    // Split input into words
    const words = input.split(/\s+/);

    // Remove stopwords
    const stopwords = [
      'a',
      'an',
      'the',
      'and',
      'or',
      'but',
      'not',
      'i',
      'in',
      'at',
      'between',
    ];
    const filteredWords = words.filter((word) => !stopwords.includes(word));

    // Grab all locations from the database
    const locations = await this.prisma.profile.findMany({
      select: {
        address: true,
      },
    });

    // Convert locations into an array of strings
    const locationList = locations.map((location) =>
      location.address.toLowerCase(),
    );

    // Grab all serviceTypes from the database
    const serviceTypes = await this.prisma.serviceCategory.findMany({
      select: {
        service_name: true,
      },
    });

    // Convert serviceTypes into an array of strings
    const serviceTypeList = serviceTypes.map((serviceType) =>
      serviceType.service_name.toLowerCase(),
    );

    // Check each word in the input against the database and find a word that is likely to be a serviceType
    // If there is just one number in the input, assume it is a price, and store that price
    let serviceTypeOutput: { input: string; output: string } = {
      input: '',
      output: '',
    };
    let specificPrice: number = 0;
    const rangePrice: { upper: number; lower: number } = { upper: 0, lower: 0 };
    let numCount: number = 0;
    for (const i in filteredWords) {
      // Check if the word is a number
      if (!isNaN(Number(filteredWords[i]))) {
        numCount++;

        // If there is only one number, assume it is a price
        if (numCount === 1) {
          specificPrice = Number(filteredWords[i]);
        }

        // If there is more then one number, it is a range
        if (numCount === 2) {
          rangePrice.lower = specificPrice;
          rangePrice.upper = Number(filteredWords[i]);
        }
      }

      // Loop and check for service types
      for (const j in serviceTypes) {
        const confidence = this.natural.JaroWinklerDistance(
          filteredWords[i],
          serviceTypeList[j],
        );
        if (confidence > 0.8) {
          serviceTypeOutput = {
            input: filteredWords[i],
            output: serviceTypes[j].service_name,
          };
          break;
        }
      }
    }

    // If we have found a servictype, remove it from the input
    if (serviceTypeOutput.output !== '') {
      filteredWords.splice(
        filteredWords.indexOf(serviceTypeOutput.input.toLowerCase()),
        1,
      );
    }

    // By the same token, remove numbers
    if (numCount > 0) {
      filteredWords.splice(filteredWords.indexOf(String(specificPrice)), 1);

      if (numCount > 2) {
        filteredWords.splice(
          filteredWords.indexOf(String(rangePrice.upper)),
          1,
        );
      }
    }

    // Merge the remaining words into a string
    const remainingInput = filteredWords.join(' ');

    // Check if the remaining input is a location
    let locationOutput: string = '';
    for (const i in locationList) {
      const confidence = this.natural.JaroWinklerDistance(
        remainingInput,
        locationList[i].toLowerCase(),
      );
      if (confidence > 0.8) {
        locationOutput = locations[i].address;
        break;
      }
    }

    // Based on what has been gathered, search the database for services that match
    // If there is a serviceType, search for that
    // If there is a location, search for that
    // If there is a price, search for that
    // If there is a range, search for that
    // If there is nothing, return all services
    let searchResult = [];
    if (
      serviceTypeOutput.output !== '' ||
      locationOutput !== '' ||
      specificPrice > 0 ||
      rangePrice.upper > 0 ||
      rangePrice.lower > 0 ||
      remainingInput !== ''
    ) {
      searchResult = await this.prisma.service.findMany({
        where: {
          OR: [
            {
              service_category: {
                service_name: {
                  contains: serviceTypeOutput.output,
                },
              },
            },
            {
              provider: {
                Profile: {
                  address: {
                    contains: locationOutput,
                  },
                },
              },
            },

            {
              OR: [
                {
                  pricing: {
                    equals: specificPrice,
                  },
                },
                {
                  pricing: {
                    gte: rangePrice.lower,
                    lte: rangePrice.upper,
                  },
                },
              ],
            },
          ],
        },
      });
    } else {
      searchResult = await this.prisma.service.findMany();
    }

    return {
      serviceTypeOutput: serviceTypeOutput.output,
      locationOutput,
      specificPrice,
      rangePrice,
      searchResult,
    };
  }
}
