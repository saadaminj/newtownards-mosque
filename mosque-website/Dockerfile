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
ENV PORT=5173

EXPOSE 5173

# Run Vite dev server, accessible from host
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
