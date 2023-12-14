cp -r ./Volume/* .
javac *.java > /app/Volume/error.txt 2>&1
java Simulation > /app/Volume/out.txt 2>&1