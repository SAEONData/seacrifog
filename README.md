# seacrifog-deploy

## Setup your VM to use a webserver (i.e. Nginx), that provides two proxies:
- TODO
- TODO

## Setup your VM to use a local Actions Runner
- Add a user to your VM `adduser actions-runner`
- Add the user to the `docker` group (this is the group that can run docker commands without `sudo`) `sudo usermod -aG docker actions-runner`

## Install the GitHub Actions runner on your VM
- Go to your repository, settings, actions, And follow the instructions to install the runner

## Setup Git credentials correctly
https://github.com/actions/checkout/issues/14#issuecomment-553383594