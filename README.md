# Taskonomy Website

The repository for code supporting the taskonomy [website](https://taskonomy.vision), for the paper *Taskonomy: Disentangling Task Transfer Learning*.

## How to update and deploy

1. Install [ruby]() and [jekyll](https://jekyllrb.com/)
```bash
sudo apt-get install rubygems
gem install bundler jekyll
```
2. Make your edits and debug. Make sure it works on local
```bash
jekyll serve --destination build	# go to http://localhost:4000
```
3. Deploy on posenet vm
```bash
scp -r build/* username@posenet.stanford.edu:/home/taskonomy/build/
```


## Components

The main components of the website are as follows
- Static website
- BIP API
- Task Demos ([repo for backend](https://github.com/alexsax/task-demo))
- Transfer Videos

## Static Website

The static website is hosted on Github Pages. Backend processing is done on AWS. The landing page is the standard `index.html`

## BIP API

The API backend is run on AWS from the file `app.py`. The `nginx.conf` file is for the API servers. 

### Setup

The API uses the GLPK solver and returns graphs made with NetworkX. Therefore, please make sure that all packages are installed with the following commands:

```
pip install glpk
pip install cvxopt
pip install networkx
pip insall jupyter
pip install ipywidgets
jupyter nbextension enable --py widgetsnbextension
```

### Usage

The API is a Flask app wrapped with GUnicorn and proxied by Nginx. It can be started with the command ```gunicorn -w 1 -t 90 -b ${my_ip}:${port} app:app```

The web version of the API also allows initialization with a config. The initialization is done with GET parameters, and the allowed parameters are:

```
task -> task_group
  task: Use the unpretty name (i.e. rgb2depth)
  task_group: one of [src_only_tasks, target_only_tasks, targets, unused] 
order -> int
budget -> int
transfer_data -> string 
  string: one of [1k, 16k]
clean_url:
  (T, boolean)  # When present, changes the url to //taskonomy.vision/api
solve:
  (T, boolean)  # When present, immediately solves
```

**Example 1.** Making _Autoencoding_ (autoencoder) a _source only_ task and changing the _max order_ to _1_. Then, immediately solve.

> [https://taskonomy.vision/api?autoencoder=src_only_tasks&order=1&solve=T](https://taskonomy.vision/api?autoencoder=src_only_tasks&order=1&solve=T)

**Example 2.** Use default _budget=6_ and use _1k transfers_. Then, make the URL clean (redirect).

> [https://taskonomy.vision/api?budget=6&transfer_data=1k&clean_url=T](https://taskonomy.vision/api?budget=6&transfer_data=1k&clean_url=T)





