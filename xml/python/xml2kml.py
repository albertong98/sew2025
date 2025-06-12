import xml.etree.ElementTree as ET

class Kml(object):
    def __init__(self):
        self.content = '<?xml version="1.0" encoding="UTF-8"?>\n'

    def add(self,string):
        self.content += string

    def newpoint(self,name,lat,long,alt):
        self.content += '\t\t<Placemark>\n'
        self.content += '\t\t\t<name>' + name + '</name>\n'
        self.content += '\t\t\t<Point><coordinates>' + str(long) +','+ str(lat) +','+ str(alt) + '</coordinates></Point>\n'
        self.content += '\t\t</Placemark>\n\n'

    def save(self,filename):
        file = open(filename,'w')
        file.write(self.content)
        file.close()

def transformarXML(archivoXML):
    try:
        arbol = ET.parse(archivoXML)
        
    except IOError:
        print ('No se encuentra el archivo ', archivoXML)
        exit()
        
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivoXML)
        exit()
    print(arbol)    
    root = arbol.getroot()
    
    for child in root:
        kml = Kml()
        kml.add('<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">\n')
        kml.add('\t<Document>\n\n')

        inicio = child.find('inicio')

        lugar = inicio.find('lugar').text
        coordenadas = inicio.find('coordenadas')
       
        lat = coordenadas.find('latitud').text
        long = coordenadas.find('longitud').text
        alt = coordenadas.find('altitud').text

        kml.newpoint(lugar,float(lat),float(long),int(alt))
        
        for hito in child.findall('./hitos/hito'):
            name = hito.find('nombre').text
            coords = hito.find('coordenadas')

            lat = coords.find('latitud').text
            long = coords.find('longitud').text
            alt = coords.find('altitud').text

            kml.newpoint(name,float(lat),float(long),int(alt))

        kml.add('\t</Document>\n</kml>')
        kml.save(child.attrib['id']+'.kml')

def main():
    file = open('rutas.xml','r')
   
    transformarXML(file)

if __name__ == "__main__":
    main()    