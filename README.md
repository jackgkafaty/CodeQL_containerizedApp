## GitHub Advanced Security - CodeQL Code Scanning within a Container.

> **Note**: This repository serves as an exemplary resource demonstrating how to set up CodeQL to scan containerized applications for vulnerabilities. Its primary objective is to showcase the implementation of CodeQL in the code scanning process.

### Getting Started

- [What is GitHub Advanced Security?](https://docs.github.com/en/enterprise-cloud@latest/get-started/learning-about-github/about-github-advanced-security)
- [What is a GitHub Action?](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions)
- [What are GitHub-hosted runners](https://docs.github.com/en/enterprise-cloud@latest/actions/using-github-hosted-runners/about-github-hosted-runners)
- [Running CodeQL code Scanning in a Container](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/running-codeql-code-scanning-in-a-container)

### Working with Containerized Applications within a GitHub hosted-runner

> **Warning** : CodeQL - code scanning requirements & support when using containers

- You must use a [supported platform/image](https://codeql.github.com/docs/codeql-overview/system-requirements/) and ensure you met the [additional software requirements](https://codeql.github.com/docs/codeql-overview/system-requirements/#additional-software-requirements).
- For compiled languages (C/C++, C#, GO, Java, etc) you must ensure that the system can successfully **build and compile your code**, independently of CodeQL
- musl-c-based Linux distributions, such as Alpine Linux, **are not supported**. _For such you will need to switch to a glibc-based system such as Debian. This is only for the Docker images used for CodeQL analysis which will need to be updated, images used for deployments or non-CodeQL CI steps can continue to use Alpine_

GitHub Actions can work with containers by allowing you to specify a container image to run your workflow/steps in. This can be useful for running your workflow in an isolated environment with specific dependencies or configurations. The container image you choose can be either a base-template or a customized image depending on your requirements.

To use a container in your workflow, you will need to specify the container key in your job definition. This key allows you to specify the image to use, as well as any additional options such as environment variables or volumes to mount.

> **Note**: **CodeQL code scanning within a container example workflow**

```yml
# Defines the name of the GitHub Actions workflow
name: GitHub Action Using a Container

# Defines the event that triggers the workflow
on:
  push:
    branches: ["main"]

# Defines the jobs that will run as part of the workflow
jobs:
  # Defines the name of the job
  GitHub_Runner:
    # Defines the operating system to run the job on
    runs-on: Ubuntu-latest

    # Defines the permissions required for the job
    permissions:
      actions: read
      contents: read
      security-events: write

    # Defines the strategy for running the job
    strategy:
      fail-fast: false
      matrix:
        language: [javascript]

    # Defines the container to use for the job
    container:
      image: node:18
      options: --cpus 1 --user root

    # Defines the steps to run in the job
    steps:
      # Checks out the repository code
      - name: Checkout repository
        uses: actions/checkout@v3

      # Installs NPM dependencies
      - name: NPM Installation
        run: |
          npm install -g typescript ts-node

      # Initializes CodeQL for the specified language
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v2
        with:
          languages: ${{ matrix.language }}

      # Performs CodeQL analysis on the code
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

When your workflow runs, GitHub Actions will start a container using the specified image and run your job inside that container. This allows you to have a consistent and isolated environment for your workflow, regardless of the host system. For more details please review the following documentation:

- [Customizing the containers used by jobs](https://docs.github.com/en/enterprise-cloud@latest/actions/hosting-your-own-runners/managing-self-hosted-runners/customizing-the-containers-used-by-jobs)
- [Running Jobs in a Container](https://docs.github.com/en/actions/using-jobs/running-jobs-in-a-container)

### Benchmarks based on the examples within this repo

> #### CodeQL code scanning for containerized applications using [GitHub Default Runners](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners)

| Example              | Programming Language | Scan completion Time     |
| -------------------- | -------------------- | ------------------------ |
| Example01_JavaScript | JavaScript           | 4 Minutes and 49 Seconds |
| Example02_Java       | Java                 | 2 Minutes and 34 seconds |
| Example03_C#         | C#                   | 7 Minutes and 47 Seconds |
| Example04_Python     | Python               | 4 Minutes and 39 Seconds |

---

> #### CodeQL code scanning for containerized applications using [GitHub Larger Runners](https://docs.github.com/en/enterprise-cloud@latest/actions/using-github-hosted-runners/about-larger-runners)

| Example              | Programming Language | Scan completion Time     |
| -------------------- | -------------------- | ------------------------ |
| Example01_JavaScript | JavaScript           | 3 Minutes 49 Seconds     |
| Example02_Java       | Java                 | 1 Minute 58 Seconds      |
| Example03_C#         | C#                   | 3 Minutes and 59 Seconds |
| Example04_Python     | Python               | 2 Minutes and 24 Seconds |

##### Larger Runner Specs:

| CPU Cores | RAM  | Storage | Base OS      |
| --------- | ---- | ------- | ------------ |
| 8 cores   | 32GB | 300 SSD | Ubuntu 22.04 |

##### Resources Assigned to the container for each example:

| CPU | RAM               | Storage           | Base OS                                      |
| --- | ----------------- | ----------------- | -------------------------------------------- |
| 5   | Container Default | Container Default | Review example workflows for container image |

---

> #### CodeQL code scanning for containerized applications - Converting the application to run natively within a < GitHub DEFAULT Runner> rather than within the container.

| Example              | Programming Language | Scan completion Time     |
| -------------------- | -------------------- | ------------------------ |
| Example01_JavaScript | JavaScript           | 2 Minutes and 23 Seconds |
| Example02_Java       | Java                 | 1 Minutes and 53 seconds |
| Example03_C#         | C#                   | 6 Minutes and 9 Seconds |
| Example04_Python     | Python               | 2 Minute 13 Seconds       |


---

> #### CodeQL code scanning for containerized applications - Converting the application to run natively within a < GitHub Larger Runner > rather than within the container.

| Example              | Programming Language | Scan completion Time     |
| -------------------- | -------------------- | ------------------------ |
| Example01_JavaScript | JavaScript           | 1 Minutes and 32 Seconds |
| Example02_Java       | Java                 | 2 Minutes and 36 seconds |
| Example03_C#         | C#                   | 3 Minutes and 16 Seconds |
| Example04_Python     | Python               | 57 Seconds       |


##### Larger Runner Specs:

| CPU Cores | RAM  | Storage | Base OS      |
| --------- | ---- | ------- | ------------ |
| 8 cores   | 32GB | 300 SSD | Ubuntu 22.04  |


---
### Considerations when using CodeQL to scan containerized applications

Running a GitHub Action in a container can have both positive and negative performance impacts compared to running the action on the base runner.

| PROS                                                                                                                                                                                          | CONS                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| - Running an action in a container can provide a consistent and isolated environment for the action to run in, which can help to avoid conflicts with other software installed on the runner. | - Running an action in a container will add overhead due to the need to start and manage the container. This can result in longer start times for the action and increased resource usage on the runner. |
| - Containers can be pre-built and cached, which can speed up the start time of the action.                                                                                                    | - You might need to increase the runners resources to improve the containers performance. This will increase usage and spending.                                                                         |
|                                                                                                                                                                                               | - Additionally, if the container image is not optimized for the action being run, it may include unnecessary software or dependencies, which can slow down the action.                                   |

### GitHub's Recommendation

Running a GitHub Action inside the runner provided by GitHub can have several advantages over running the action inside a container inside the runner. Here are a few reasons why you might want to run your action inside the runner:

- **Faster start times**: Running an action inside the runner can be faster than running it inside a container because there is no need to start and manage the container.

- **Lower resource usage**: Running an action inside the runner can use fewer resources than running it inside a container because there is no need to allocate resources for the container.

- **Easier configuration**: Running an action inside the runner can be easier to configure than running it inside a container because there is no need to specify the container image or manage the container environment.

- **Better compatibility**: Running an action inside the runner can be more compatible with other actions and workflows because it uses the same environment as the runner

> **Note** When possible we highly recommend that you convert your containzaried application into a native GitHub Action. Converting a containerized application into a native GitHub Action can provide several benefits, such as improved performance, better integration with other GitHub features, easier maintenance, and increased security. By converting a containerized application into a native GitHub Action, you can avoid the need to build and manage a container, which can simplify your workflow and reduce the overhead of running your actions. Additionally, native GitHub Actions can be versioned and released like other code, which can make it easier to maintain and update your actions over time.
