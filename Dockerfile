FROM node:18-alpine

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json first for optimal caching
COPY package*.json ./

# Install dependencies, Nest.js CLI, and generate Prisma client
# Combining these steps into a single RUN command reduces the number of layers
RUN npm install && \
    npm install -g @nestjs/cli && \
    npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the Nest.js app
RUN npm run build

# Remove development dependencies to reduce image size
RUN npm prune --production

# Expose ports for the app
EXPOSE 3001 3306

# Deploy Prisma db and start the app
CMD sh -c "sleep 10 && npx prisma db push && npm run start:prod"

