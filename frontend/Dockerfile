# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the package.json and package-lock.json
COPY package*.json ./

# Remove node_modules and package-lock.json if they exist
RUN rm -rf node_modules package-lock.json

# Install the dependencies
RUN npm install --ignore-platform

# Copy the rest of the application code
COPY . .

# Expose the port Angular will run on
EXPOSE 4200

# Start the Angular application
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]
