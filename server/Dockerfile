# Use official Node.js image 
FROM node:alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install nodemon globally
RUN npm install -g nodemon  

# Copy the rest of your application code
COPY . .

# Set up the port your app listens on
ENV PORT=3000

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
