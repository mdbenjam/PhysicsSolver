'''eq1 = ['a=b*c*d','a', 'b', 'c', 'd']
eq2 = ['f=e+m','f', 'e','m']
eq3 = ['e=a-5','e','a']
eq4 = ['f=e+b-d*z','f','e','b','d','z']
eq_list = []
eq_list.append(eq1)
eq_list.append(eq2)
eq_list.append(eq3)
eq_list.append(eq4)
'''

import string
import math
from sympy import S, Eq, solve

def readEquations(inputFile):
    equationFile = open(inputFile)

    symbols = ['+', '-', ',', '*', '/', '(', ')', '^' , '**']
    functions = ['sqrt(', 'math.sin(', 'math.cos(', 'tan(', 'log(']
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


def solve_for(equation, symbol):
    return solve(equation, symbol)[0]


def substitute(expression, **kwargs):
    return expression.subs(kwargs)


def solvefor(value_dic, input_list ,desired):
    eq_list = readEquations("equations2.txt")
    return_dic = {}
    #input_list = ['x','a','f','q']
    #desired = 'r'
    
    #TEST2 input_list = ['mols','mass']
    #TEST2 desired = 'molar_mass'
    print "Input: " + str(input_list)
    #input_list = ['v0','angle','ay','vyf','dy0']
    #desired = 'dyf'
    
    #input_list = ['pressure','volume','temperature','number_molecules','molecular_mass']
    #desired = 'v_rms'
    
    found_list = []
    solution_equations = []
    solved_for_list = []
    loops = 0
    solved_dic = {}
    #value_dic = {'x':5,'a':2,'f':3,'q':10}
    #value_dic = {'v0':5,'angle':45,'ay':-9.8,'vyf':0,'dy0':0}
    
    while(loops < 5):
        for i1 in range(len(eq_list)):
            equation_length = len(eq_list[i1])-1
            collisions = 0
            for i2 in range(1, len(eq_list[i1])):    
                #print eq_list[i1][i2]
                for i3 in range(len(input_list)):
                    if(input_list[i3] == eq_list[i1][i2]):
                        collisions+=1           
            if(collisions == equation_length-1): #Any False Cases?
                solution_equations.append(eq_list[i1][0])
                for i2 in range(1, len(eq_list[i1])):
                    matches = 0
                    for i3 in range(len(input_list)):
                        if(input_list[i3] == eq_list[i1][i2]):
                            matches+=1
                    if(matches == 0):
                        input_list.append(eq_list[i1][i2])
                        found_list.append(eq_list[i1][i2])
        loops+=1
        #print "Input2: " + str(input_list)
        for i4 in range(len(input_list)):
            print str(input_list), desired
            if(input_list[i4] == desired):
                loops=100
        #print input_list
        if(len(solution_equations) == 0):
            return_dic = {'value':"No Solution Found"}
            return return_dic;        
        print solution_equations        
        for i in range(len(input_list)):
            exec(str(input_list[i]) + " = S('" + input_list[i] + "')")
        for i in range(len(solution_equations)):
            if(i == 0):
                solved_for_list.append(solve_for(eval("Eq(%s)"%solution_equations[i]), found_list[i]))
            else:
                solved_dic[found_list[i-1]] = solved_for_list[i-1]
                solved_for_list.append(solve_for(substitute(eval("Eq(%s)"%solution_equations[i]), **solved_dic), found_list[i]))
                #print solved_for_list
        print "We used " + str(len(solution_equations)) + " equations and found a numerical answer of:"
        #for i in range(len(input_list)):
        #    substitute(solved_for_list[-1], a=2)
        return_dic['compound'] =  str(solved_for_list[-1])
        print desired + " = " + str(substitute(solved_for_list[-1], **value_dic))
        return_dic['value']  = str(substitute(solved_for_list[-1], **value_dic))
        return_dic['eqs'] = solution_equations
        return_dic['desired'] = desired
        
        #print desired + " = " + str(substitute(solved_for_list[-1], pressure=1.5, volume=5.0, molecular_mass=40.0, number_molecules=1000.0))
        #print solve_for(eval("Eq(%s)"%solution_equations[-1]), m)
        #print substitute(substitute(m + x, m=f/a, x=10), f=20, a=2)
        return return_dic
