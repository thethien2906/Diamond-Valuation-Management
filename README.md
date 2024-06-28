Diamond Valuation Management

This project consists of a frontend built with React and Vite, a backend built with Node.js and Express, and a MongoDB database. It is designed to help manage diamond valuation records.


Project Structure


your-project-root/

├── compose.yml

├── client/

│   └── ...

├── server/

│   └── ...

└── README.md


Prerequisites

Docker: Ensure Docker is installed on your machine. Download it from Docker's official website.

Setup Instructions

1. Clone the Repository
   
Clone the project repository to your local machine:

git clone https://github.com/thethien2906/Diamond-Valuation-Management

2. Tag and Push Docker Images
   
Tag the Docker images with your Docker Hub username and repository names:

      docker tag diamond-valuation-management-frontend wusxo/diamondshine:frontend
          
      docker tag diamond-valuation-management-backend wusxo/diamondshine:backend
          
      docker tag mongo wusxo/diamondshine:mongo

Push Docker Images

Push the tagged images to Docker Hub:

      docker push wusxo/diamondshine:frontend
      
      docker push wusxo/diamondshine:backend
      
      docker push wusxo/diamondshine:mongo

3. Docker Compose Configuration
   
You can use two different docker-compose.yml configurations depending on whether you want to build the images locally or pull pre-built images from Docker Hub.

Option A: Build Locally

Use this configuration if you want to build the images locally for development:

    services:

    frontend:
  
    build:
    
      context: ./client
      
      dockerfile: Dockerfile
      
    ports:
    
      - "5173:5173"
      
    depends_on:
    
      - backend
      
    environment:
    
      - VITE_API_URL=http://backend:3000
      

    backend:
  
    build:
    
      context: ./server
      
      dockerfile: Dockerfile
      
    ports:
    
      - "3000:3000"
      
    environment:
    
      - MONGO_URL=<In .env file>
      
    depends_on:
      - mongo

    mongo:
  
    image: mongo:latest
    
    ports:
    
      - "27017:27017"
      
    environment:
    
      - MONGO_INITDB_ROOT_USERNAME=root
      
      - MONGO_INITDB_ROOT_PASSWORD=example
      
    container_name: mongo
    

To build and run the containers locally, use:

    docker-compose up --build


Option B: Pull from Docker Hub

Use this configuration if you want to pull pre-built images from Docker Hub:


    services:

    frontend:
  
    image: wusxo/diamondshine:frontend
    
    ports:
    
      - "5173:5173"
      
    depends_on:
    
      - backend
      
    environment:
    
      - VITE_API_URL=http://backend:3000
      

    backend:
  
    image: wusxo/diamondshine:backend
    
    ports:
    
      - "3000:3000"
      
    environment:
    
      - MONGO_URL=<in .env file>
      
    depends_on:
    
      - mongo
      

    mongo:
  
    image: wusxo/diamondshine:mongo
    
    ports:
    
      - "27017:27017"
      
    environment:
    
      - MONGO_INITDB_ROOT_USERNAME=root
      
      - MONGO_INITDB_ROOT_PASSWORD=example
      
    container_name: mongo

    
    volumes:
  
    mongo-data:
  
  
To pull the images and run the containers, use:

    docker-compose up

4. Access the Application
   
   
    Frontend: Open your web browser and navigate to http://localhost:5173.
    
    Backend API: The backend API is available at http://localhost:3000.
    
    MongoDB: The MongoDB database is accessible at mongodb://localhost:27017.
    


