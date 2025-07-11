s = ""
x = 0
while len(s) < 10:
    c = chr(x)
    x += 1
    try:
        if int(c) == 7 and c.isdigit():
            s += c
    except:
        pass

print(s)