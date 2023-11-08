import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('search')
@ApiTags('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get(':input')
  @ApiOperation({ summary: 'Search naturally for contacts' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async search(@Param('input') input: string) {
    return await this.searchService.search(input);
  }
}
