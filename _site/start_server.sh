
my_ip=$(curl http://169.254.169.254/latest/meta-data/local-ipv4)
source activate analysis

for i in 0 1 2 3 4;
do
    let "port=8080 + $i"
    gunicorn -w 1 -t 90 -b ${my_ip}:${port} app:app &
done

