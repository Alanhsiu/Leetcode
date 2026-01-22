# ✍️ `std::string` Core Usage for Coding Tests 🚀

---

**What it is:** A powerful class that encapsulates character strings, handling memory management and providing a rich set of manipulation functions.

**Core Benefit:** Safe memory management, a rich feature set for string manipulation, and easy integration with the C++ Standard Library.

---

### ✨ **Core Operations & Syntax**

This section focuses on the functions most frequently required to solve problems.

| Operation            | Code Example                                | Notes                                                                                                                                                  |
| :------------------- | :------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Substring**        | `s.substr(pos, len);` <br> `s.substr(pos);` | Two overloads: `substr(pos, len)` extracts `len` chars from `pos`, `substr(pos)` extracts from `pos` to end. **Returns a new string (incurs a copy).** e.g., `s.substr(i, j-i+1)` gets substring from index `i` to `j`. |
| **Find Substring**   | `s.find("world");` <br> `s.rfind('o');`     | `find` searches from the start, `rfind` from the end. Returns the starting index or `std::string::npos` if not found.                                  |
| **Replace**          | `s.replace(pos, len, "C++");`               | Replaces the section of `len` characters at `pos` with a new string.                                                                                   |
| **Insert**           | `s.insert(pos, "awesome ");`                | Inserts a string at the specified index `pos`.                                                                                                         |
| **Erase**            | `s.erase(pos, len);`                        | Erases `len` characters starting from index `pos`.                                                                                                     |
| **C-style String**   | `printf("%s", s.c_str());`                  | Returns a `const char*` pointer, mainly for compatibility with C-style functions.                                                                      |
| **Append Char**      | `s.push_back('!');`                         | Appends a single character to the end of the string. Often efficient.                                                                                  |
| **Remove Last Char** | `s.pop_back();`                             | Removes the last character from the string.                                                                                                            |
| **Reserve Memory**   | `s.reserve(100);`                           | Allocates memory for at least 100 characters to prevent reallocations during repeated appends.                                                         |

---

### 🔄 **Common Patterns for Problems**

These code snippets solve frequent sub-problems in coding challenges.

- **Splitting a String by Delimiter**

  ```cpp
  std::string text = "apple,banana,cherry";
  std::string delimiter = ",";
  std::vector<std::string> parts;

  size_t pos = 0;
  std::string token;
  // Keep finding the delimiter
  while ((pos = text.find(delimiter)) != std::string::npos) {
      token = text.substr(0, pos);
      parts.push_back(token);
      // Erase the part we just processed
      text.erase(0, pos + delimiter.length());
  }
  parts.push_back(text); // Add the final part
  // parts now contains: {"apple", "banana", "cherry"}
  ```

- **Replacing All Occurrences of a Substring**

  ```cpp
  std::string story = "The sky is blue. The ocean is blue.";
  std::string from = "blue";
  std::string to = "red";

  size_t start_pos = 0;
  // Find the next occurrence from start_pos
  while((start_pos = story.find(from, start_pos)) != std::string::npos) {
      story.replace(start_pos, from.length(), to);
      // Move past the replaced part to avoid infinite loops
      start_pos += to.length();
  }
  // story is now "The sky is red. The ocean is red."
  ```

---

### 💡 **Key Use Cases in Contests**

- **Parsing Input:** Breaking down problem input lines into usable tokens or numbers.
- **String Manipulation:** Palindrome checks, anagrams, finding patterns, etc.
- **Building Output:** Constructing a complex string result from various pieces of data.
- **Searching & Replacing:** Modifying strings based on specific rules described in a problem.

---

### 🧠 **Performance & Best Practices**

- **Pass by Constant Reference:** Always pass strings to functions as `const std::string&` to avoid making expensive copies.

  ```cpp
  // Good: Avoids a copy
  void processString(const std::string& s);

  // Bad: Makes a full copy of the string on every call
  void processString(std::string s);
  ```

- **Use `reserve()` When Building Strings:** If you are building a large string in a loop, calling `reserve()` beforehand can provide a significant speedup by avoiding multiple memory reallocations.
- **`std::string::npos`:** The `find` family of functions returns this special static value (which is usually -1) to indicate failure (not found). Always check against `npos`.
