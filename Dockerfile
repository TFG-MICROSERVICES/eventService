# Usa una imagen base adecuada
FROM node:22

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos del proyecto al contenedor
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto en el que la aplicación va a correr
EXPOSE 3005

# Inicia la aplicación con el comando `npm run dev`
CMD ["npm", "run", "dev"]
