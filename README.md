# Digital

Dijital is a Django project that provides a centralized platform for a corporate company to manage and share links,
announcements, and files of all its applications.

## ToDo

- [ ] Edit `settings.py` file and add `.env` file to the project.
- [ ] Add `Dockerfile` file to the project.

## Installation

### Requirements

- Python 3.x
- Node.js
- Git

### Setup

```bash
# Clone the project
git clone https://github.com/mokoco/digital.git

# Create a virtual environment and activate it
cd digital
python -m venv venv
source venv/bin/activate

# Install the dependencies
pip install -r requirements.txt
npm install

# Compile the sass files
sass scss:static/css

# Migrate the database
python manage.py makemigrations
python manage.py migrate

# Create a superuser
python manage.py createsuperuser

# Run the server
python manage.py runserver
```

The application should now be accessible at http://localhost:8000.

## Contribution

Contributions to this project are welcome. If you have any issues or feature requests, please open an issue on the
project repository.

## License

This project is licensed under the MIT License. See the LICENSE file for details.