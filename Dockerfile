FROM node:lts-alpine

# Set the working directory
WORKDIR /

# Copy package.json and package-lock.json first for optimal caching
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies, Nest.js CLI, and generate Prisma client
# Combining these steps into a single RUN command reduces the number of layers
RUN npm install && \
    npm install -g @nestjs/cli && \
    npx prisma generate

# Build the Nest.js app
RUN npm run build

# Remove development dependencies to reduce image size
RUN npm prune --omit-dev

# Expose ports for the app
EXPOSE 3001

# Deploy Prisma db and start the app
CMD sh -c "sleep 10 && npx prisma db push && npm run seed && npm run start:prod"

