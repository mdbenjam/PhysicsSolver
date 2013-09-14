import string

def readEquations(inputFile):
    equationFile = open(inputFile)

    symbols = ['+', '-', '=', '*', '/', '(', ')', '^']
    functions = ['sin(', 'cos(', 'tan(', 'log(']
    equations = []
    for line in equationFile:
        if line[0] == '#' or line == '\n':
           continue 

        if (line[-1] == '\n'):
            line = line[0:-1]
        entry = []
        entry.append(line)
        
        splitLine = string.split(line, ' ')
        for var in splitLine:
            if var in symbols or var in functions:
                continue
            try:
                float(var)
            except ValueError:
                if not (var in entry):
                    entry.append(var)

        equations.append(entry)

    return equations
