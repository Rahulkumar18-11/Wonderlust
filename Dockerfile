FROM node:20-alpine

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose default application port
EXPOSE 8000

# Start server
CMD ["node", "app.js"]

