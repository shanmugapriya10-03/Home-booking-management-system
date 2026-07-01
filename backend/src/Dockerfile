FROM node:20

WORKDIR /app

# Copy package.json & package-lock.json from parent folder
COPY ../package*.json ./

RUN npm install

# Copy all files from src folder into /app
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
