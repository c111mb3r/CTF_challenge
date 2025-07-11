using System;
using System.Text;
using System.Globalization;
using System.Collections.Generic;
using System.Linq;

class ComprehensiveSearch
{
    static bool IsSafeChar(char c)
{
    var cat = char.GetUnicodeCategory(c);
    var isLetter = cat == UnicodeCategory.LowercaseLetter ||
    cat == UnicodeCategory.UppercaseLetter ||
    cat == UnicodeCategory.OtherLetter;

    return isLetter || char.IsWhiteSpace(c);
}

static void Main()
{
    Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

    Console.WriteLine("Starting comprehensive search...\n");

    // Get all available encodings
    var encodings = Encoding.GetEncodings();
    Console.WriteLine($"Total encodings to test: {encodings.Length}");

    // Find all chars that pass IsSafeChar
    var safeChars = new List<char>();
    for (int i = 0; i < 0x10000; i++)
    {
        char c = (char)i;
        if (IsSafeChar(c))
        {
            safeChars.Add(c);
        }
    }
    Console.WriteLine($"Total safe chars to test: {safeChars.Count}\n");

    // Test each encoding with each safe char
    foreach (var encodingInfo in encodings)
    {
        try
        {
            var encoding = Encoding.GetEncoding(encodingInfo.CodePage);

            foreach (var c in safeChars)
            {
                try
                {
                    byte[] bytes = encoding.GetBytes(new char[] { c });

                    if (bytes.Contains((byte)0x27))
                    {
                        Console.WriteLine($"FOUND!");
                        Console.WriteLine($"  Encoding: {encodingInfo.Name} (CodePage: {encodingInfo.CodePage})");
                        Console.WriteLine($"  Character: U+{(int)c:X4} '{c}'");
                        Console.WriteLine($"  Category: {char.GetUnicodeCategory(c)}");
                        Console.WriteLine($"  Bytes: {BitConverter.ToString(bytes)}");
                        Console.WriteLine($"  URL Encoded: {Uri.EscapeDataString(c.ToString())}");
                        Console.WriteLine();
                    }
                }
                catch
                {
                    // Character not encodable in this encoding
                }
            }
        }
        catch
        {
            // Encoding not available
        }
    }

    Console.WriteLine("Search complete.");
}
}