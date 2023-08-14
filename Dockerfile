# Usa una imagen base de Node.js
FROM node:16.19.0

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de la aplicación al contenedor
COPY package*.json ./
COPY . .

# Instala las dependencias de la aplicación
RUN npm install

# Expone el puerto en el que la API escucha
EXPOSE 3000

# Copia el script de inicio a la imagen
COPY start.sh .

# Concede permisos de ejecución al script
RUN chmod +x start.sh

# Comando para ejecutar el script de inicio cuando el contenedor se inicie
CMD ["./start.sh"]