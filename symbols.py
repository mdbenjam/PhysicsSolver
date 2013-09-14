from sympy import S, Eq, solve


def solve_for(equation, symbol):
    """
    >>> f, m, a = S('f'), S('m'), S('a')
    >>> solve_for(Eq(f, m * a), m)
    f/a
    """
    return solve(equation, symbol)[0]


def substitute(expression, **kwargs):
    """
    >>> a, x = S('a'), S('x')
    >>> substitute(a + x, a=5, x=10)
    15
    """
    return expression.subs(kwargs)
