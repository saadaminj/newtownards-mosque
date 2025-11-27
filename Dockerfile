# Dockerfile.node (in project-root)
FROM node:24.11.0

# Set working directory inside the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the project files
COPY . .

# Default env
ENV NODE_ENV=production

# You can override CMD per project using package.json "start" script
CMD ["npm", "run", "start"]
