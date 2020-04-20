

my_id=$(curl http://169.254.169.254/latest/meta-data/instance-id)
aws elb register-instances-with-load-balancer \
    --load-balancer-name TaskonomyApiElb \
    --instances ${my_id} \
    --region $AWS_REGION


