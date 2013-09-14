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
from sympy import S, Eq, solve


def readEquations(inputFile):
    equationFile = open(inputFile)

    symbols = ['+', '-', ',', '*', '/', '(', ')', '^' , '**']
    functions = ['sqrt(', 'sin(', 'cos(', 'tan(', 'log(']
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


def solvefor(value_dic, input_list, desired):
    # [equation, *args]
    eq_list = readEquations("equations2.txt")
    # return value
    rv = {}
    # variables we are able to solve for now
    found_list = []
    # equations in chronological order used to find found_list
    solution_equations = []
    # solution_equations rewritten in terms of found_list
    solved_for_list = []
    # number of iterations
    loops = 0
    while(loops < 5):
        # for every equation in equation list
        for i1 in range(len(eq_list)):
            # number of variables in equations
            equation_length = len(eq_list[i1]) - 1
            # number of matches between input and current equation
            collisions = 0
            # count collisions
            for i2 in range(1, len(eq_list[i1])):
                for i3 in range(len(input_list)):
                    if(input_list[i3] == eq_list[i1][i2]):
                        collisions += 1
            # check if we're able to solve for another variable
            if collisions == equation_length - 1:
                solution_equations.append(eq_list[i1][0])
                for i2 in range(1, len(eq_list[i1])):
                    # 
                    matches = 0
                    for i3 in range(len(input_list)):
                        if(input_list[i3] == eq_list[i1][i2]):
                            matches += 1
                    if matches == 0:
                        input_list.append(eq_list[i1][i2])
                        found_list.append(eq_list[i1][i2])
        loops += 1
        # break out of loop
        for i4 in range(len(input_list)):
            if input_list[i4] == desired:
                loops = 100
        # set symbols
        for i in range(len(input_list)):
            exec(str(input_list[i]) + " = S('" + input_list[i] + "')")
        assert solution_equations, solution_equations
        for i in range(len(solution_equations)):
            if(i == 0):
                solved_for_list.append(solve_for(eval("Eq(%s)"%solution_equations[i]), found_list[i]))
            else:
                solved_for_list.append(solve_for(substitute(eval("Eq(%s)"%solution_equations[i]), **solved_dic), found_list[i]))
        #for i in range(len(input_list)):
        #    substitute(solved_for_list[-1], a=2)
        rv['compound'] = str(solved_for_list[-1])
        rv['value']  = str(substitute(solved_for_list[-1], **value_dic))
        rv['eqs'] = solution_equations
        rv['desired'] = desired
        return rv
