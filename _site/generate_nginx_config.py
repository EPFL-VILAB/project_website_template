from __future__ import print_function

from subprocess import Popen, PIPE

def make_conf(ip):
    return """
    upstream mywebapp {{
        server {ip}:8080 weight=1;
        server {ip}:8081 weight=1;
        server {ip}:8082 weight=1;
        server {ip}:8083 weight=1;
        server {ip}:8084 weight=1;
    }}

    server {{
        listen 8887;
    
        location / {{
            proxy_pass http://mywebapp;
        }}
    }}
    """.format(ip=ip)

if __name__ == "__main__":
    p = Popen(['curl', 'http://169.254.169.254/latest/meta-data/local-ipv4'], stdin=PIPE, stdout=PIPE, stderr=PIPE)
    ip, err = p.communicate(b"input data that is passed to subprocess' stdin")
    ip = ip.decode('utf-8')
    # ip = "127.0.0.1"
    print(make_conf(ip))



