FROM node:24.11.0

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install 

# Copy source code
COPY . .

# Env (optional)
ENV NODE_ENV=development
ENV PORT=4173

EXPOSE 4173

CMD ["npm", "run", "prod"]

