ps -ef | grep gunicorn | grep -v grep | awk '{print $2}' | xargs kill -9
