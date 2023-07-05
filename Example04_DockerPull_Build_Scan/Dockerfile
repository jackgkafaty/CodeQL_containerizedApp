FROM ubuntu:latest

ARG user=python
ARG home=/home/$user

RUN adduser \
    --disabled-password \
    --home $home \
    $user

WORKDIR /myapp
ENV PYTHONPATH "${PYTHONPATH}:/myapp"
ENV PATH="/usr/local/bin:/usr/bin:${PATH}"

COPY client .

RUN apt-get update && \
    apt-get upgrade -y && \
    #apt-get install -y python3-pip && \
    #python3 -m pip install pipenv && \
    #python3 -m pipenv install --system && \
    apt-get install -y curl unzip && \
    apt-get install -y npm  && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


CMD ["python", "-m", "myapp"]
#CMD ["sleep", "infinity"]
#ENTRYPOINT ["/bin/sh", "-c", "echo Welcome User"]
