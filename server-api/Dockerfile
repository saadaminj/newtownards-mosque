FROM node:24.11.0

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code (but NOT the DB file, we mount that separately)
COPY . .

# Default envs (can be overridden by docker-compose)
ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

# Adjust if your start script is different
CMD ["npm", "start"]
