#!/bin/bash
# start.sh

# Ejecuta el primer comando
echo "Ejecutando npm run server"
npm run server &

# Espera un poco para asegurarse de que el primer comando esté en funcionamiento
sleep 5

# Ejecuta el segundo comando
echo "Ejecutando npm run dev"
npm run dev