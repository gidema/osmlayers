import csv

# Main
def main():
    layers = []
    with open("layers.csv", "r") as csvfile:
        for layer in csv.DictReader(csvfile):
            layers.append(layer)
    createLayerConfig(layers)

# Functions
def createLayerConfig(layers):
    with open("config.js", "w") as json:
        json.write("{\n")
        json.write("layers: {\n")
        for i in range(0, len(layers)):
            layer = layers[i]
            json.write("  {0}: {{id: '{0}', name: '{1}', query: '{2}', icon: '{3}'}}". \
                format(layer['id'], layer['name'], layer['query'], layer['icon']))
            json.write(',\n' if i < len(layers) - 1 else '\n')
        json.write("}}\n")
        
#Call main procedure
main()
