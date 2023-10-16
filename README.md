# Take-Home-Exercise 02

## Purpose

Get a better understanding of HTTP and Js.

## Task

Make a page that makes it possible to implement a simple calculator function in a URL.

Enter the type of calculation at the end of the URL and enter two numbers as parameters after the question mark. The page is asked to return the result of the calculation.

## Example

Input like:

```URL
{
.../sum?operand1=42&operand2=45
.../multiply?operand1=42&operand2=45
.../sum {operand1: 42, operand: 45}
}
```

Output (For the 1st. input example above):
`87` or
```
42 + 45 = 87
```

## Voraussetzungen (Inportiert)

1. nodeJS installieren
2. `npm install` in diesem Verzeichnis ausführen
3. `npm run start` ausführen um die Anwendung zu starten
4. Im Browser `http://localhost:3000/webapp/index.html` ansteuern
