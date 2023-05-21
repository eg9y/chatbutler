# Use the official Node.js image as the base image
FROM node:20.0.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock into the working directory
COPY package.json yarn.lock ./

# Install the project dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the project files into the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Start the development server
CMD ["yarn", "dev"]
