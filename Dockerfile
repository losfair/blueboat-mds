FROM golang:1.17.3-bullseye
RUN apt update && apt install -y build-essential wget
WORKDIR /root
RUN wget https://www.foundationdb.org/downloads/6.3.22/ubuntu/installers/foundationdb-clients_6.3.22-1_amd64.deb && dpkg -i foundationdb-clients_6.3.22-1_amd64.deb
COPY . /app
WORKDIR /app
RUN go build

FROM debian:bullseye-slim
COPY --from=0 /root/foundationdb-clients_6.3.22-1_amd64.deb /root/
RUN dpkg -i /root/foundationdb-clients_6.3.22-1_amd64.deb
COPY --from=0 /app/blueboat-mds /usr/bin/
ENTRYPOINT ["/usr/bin/blueboat-mds"]
