# Imagen base oficial de Node
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Compilar el proyecto para producción
RUN npm run build

# Exponer el puerto 3000
EXPOSE 3000

# Comando para ejecutar el proyecto
CMD ["npm", "start"]
