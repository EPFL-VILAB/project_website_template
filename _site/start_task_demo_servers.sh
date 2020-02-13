
my_ip=$(curl http://169.254.169.254/latest/meta-data/local-ipv4)

for i in 0 1 2 3 4;
do
    let "port=8080 + $i"
    gunicorn -w 2 -t 90 -b ${my_ip}:${port} task_demo_api:app &
done

