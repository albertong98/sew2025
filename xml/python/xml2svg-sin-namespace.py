import xml.etree.ElementTree as ET

class Svg(object):
    altList = []
    distDictionary = {}

    def __init__(self):
        """
        Crea el elemento raíz y el espacio de nombres
        """
        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg",width="1400",height="700")
        self.height = 450
        self.width = 1200

    def save(self,filename):
        """
        Escribe el archivo SVG con declaración y codificación
        """
        arbol = ET.ElementTree(self.raiz)
        arbol.write(filename, encoding='utf-8', xml_declaration=True)
        print('Archivo '+filename+' guardado correctamente')
    
    def generatePolyline(self):
        #Generamos linea que une todos los puntos de altitud comenzando y acabando por el 0
        element = ET.SubElement(self.raiz,'polyline',points=" ".join(self.puntos),fill="none",stroke="red")
        element.attrib['stroke-width'] = "6"
        #Generamos linea que une inicio y final
        element = ET.SubElement(self.raiz,'polyline',points=" ".join([self.puntos[0],self.puntos[-1]]),fill="none",stroke="red")
        element.attrib['stroke-width'] = "6"
    
    def addTextElement(self,cx,text):
        element = ET.SubElement(self.raiz,'text',fill="black",x=cx,y="460",style="writing-mode: tb; glyph-orientation-vertical: 0;")
        element.attrib['font-size']="20"
        element.text = text

    def generatePoints(self):
        self.puntos = []
        cx = 40
        cy = 0
        x = (self.width-(cx*2)) / sum(self.distDictionary.values())
        y = self.height / max(self.altList)
        
        self.puntos.append('0,450')
        for dist, alt in zip(self.distDictionary, self.altList):
            cy = self.height - (alt * y)
            cx += self.distDictionary[dist] * x
            self.puntos.append(str(cx)+','+str(cy))
            self.addTextElement(str(cx),dist)

        self.puntos.append(str(self.width)+','+str(self.height))


    def parseDistancesAndAltitudes(self,hitos):
        for hito in hitos:
            name = find('nombre',hito).text
            coordenadas = find('coordenadas',hito)
            alt = float(find('altitud',coordenadas).text)
            dist = float(find('distancia',hito).text)
            self.altList.append(alt)
            self.distDictionary[name] = dist
    
    def parseInicio(self,inicio):
        name = find('lugar',inicio).text
        coordenadas = find('coordenadas',inicio)
        alt = float(find('altitud',coordenadas).text)
        dist = 0
        self.altList.append(alt)
        self.distDictionary[name] = dist

def transformarXML(archivoXML):
    try:
        arbol = ET.parse(archivoXML)
        
    except IOError:
        print ('No se encuentra el archivo ', archivoXML)
        exit()
        
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivoXML)
        exit()
    
    root = arbol.getroot()
    
    i = 0
    
    svg = Svg()

    for ruta in root.findall('ruta'):
        svg.parseInicio(ruta.find('inicio'))
        svg.parseDistancesAndAltitudes(ruta.findall('.hitos/hito'))
        svg.generatePoints()
        svg.generatePolyline()
        svg.save(ruta.attrib['id']+'.svg')

def find(child,parent):
    return parent.find(child)

def main():
    file = open('rutas.xml','r',encoding='utf-8')
   
    transformarXML(file)

if __name__ == "__main__":
    main()