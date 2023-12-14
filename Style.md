# ZigZag Style and Formatting Document

## Services
### Frontend
- **Framework:** React
    - **Justification:** React is an extremely popular and powerful tool for building user interfaces in javascript. It is used by a number of large companies such as Discord, Instagram, and Pinterest. Do to its power and popularity, we decided it was a good choice for our project.
- **Style/Formatter:** Prettier
    - **Justification:** Prettier is an auto-formatter for javascript code. It aims to ensure all code is formatted to the same standards and remove the need for the programmer to worry about stylistic choices while they write their code. This made it a good choice for our project.
- **Linter:** ESLint
    - **Justification:** ESLint is an incredibly popular linting tool for javascript - the plugin has over 30 million installs on VS Code alone. It statically analyzes javascript code to find problems. It is a standard in javascript development and therefore was included in our project.

### Backend
- **Framework:** Django
    - **Justification:** Django is a powerful web application framework written for Python and is used by a number of large companies (Mozilla, Pinterest, Instagram, etc.). Due to both its power as a framework and applicability to the real world we decided that Django was a good fit for our application.
- **Style/Formatter:** Black
    - **Justification:** Black is a highly opinionated auto-formatter for Python. It is used by many notable python packages (Django, SQLAlchemy, pandas, etc.) as well as a number of notable software development companies (Dropbox, Facebook, Quora, Tesla, etc.). The core idea behind the Black formatter is that all python code which uses it will look the same regardless of the project, author, or editor. This results in code that always follows conventions as well as produces the smallest possible diffs since all code will be formatted identically. Do to its utility and applicability to industry, we decided that formatting our code with Black was the right decision.
- **Linter:** Flake8
    - **Justification:** Flake8 is a tool that combines pycodestyle, pyflakes, and other tools together into a single package for linting python code. While much of the functionality is covered by the Black autoformatter, this tool provides a few additional stylistic checks for coding practices that lower the overall code quality that are not necessarily related to the structural formatting which Black handles. Due to the importance of having clean code and the popularity of the Flake8 linter, we decided that it was a good fit for our application.

### Simulator
- **Framework:** Java
- **Style/Formatter:** Google
    - **Justification:** The Google Java Style Guide seems to be the closest to the universal industry standard. It is also more recent than other popular Java style guides and therefore more relevant in terms of readability and general good java programming practices. Because of this, we decided it would be best for our application.
- **Linter:** Checkstyle
    - **Justification:** Checkstyle is a tool highly prominent in industry for checking and enforcing java style. The service is actively maintained and able to be used as plugins with popular java IDE's. It is fairly easy to set our format as desired, and equally as easy to change it. There are many formats that checkstyle supports, so if we would like to pivot at any point to a style other than the Google Java Style, we can make that switch easily. Because of its high power, ease of use, and proposed flexibility, we decided it would be good for our application.
