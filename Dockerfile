# First stage: build
FROM node:18-buster as builder

# Install necessary build tools
RUN apt-get update && apt-get install -y build-essential python

WORKDIR /app

# Copy all directories
COPY . .

# Install all packages
RUN yarn install

# Build shared and server packages
RUN yarn workspace shared build
RUN yarn workspace server build

# Second stage: runtime
FROM node:18-buster

WORKDIR /app

# Copy over built application and production dependencies from the build stage
COPY --from=builder /app .

CMD [ "yarn", "workspace", "server", "start:dev" ]
