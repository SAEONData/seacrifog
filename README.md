# seacrifog-deploy

## Setup your VM to use a webserver (i.e. Nginx), that provides two proxies:
- TODO
- TODO
- TODO
- TODO: Mention how to add docker-compose to path

## Setup your VM to use a local Actions Runner
- Add a user to your VM `adduser actions-runner`
- Add the user to the `docker` group (this is the group that can run docker commands without `sudo`) `sudo usermod -aG docker actions-runner`

## Install the GitHub Actions runner on your VM
- Go to your repository, settings, actions, And follow the instructions to install the runner
- Enable `sudo` command for the actions-runner user for the service script: https://help.github.com/en/actions/automating-your-workflow-with-github-actions/configuring-the-self-hosted-runner-application-as-a-service

## Setup Git credentials correctly
https://github.com/actions/checkout/issues/14#issuecomment-553383594