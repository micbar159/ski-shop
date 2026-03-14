# https://learn.microsoft.com/en-us/dotnet/core/docker/container-images
#docker buildx build -f SkiShop.API/Dockerfile -t skishop .

FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src
COPY . .
RUN dotnet publish "/src/SkiShop.API/SkiShop.API.csproj" -o /published /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine
# install package that .NET uses for cultures (eg. en-US)
RUN apk add --no-cache icu-libs
# make sure the culture invariant mode is disabled (it crashes mssql connection)
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
WORKDIR /app
COPY --from=build /published .
ENTRYPOINT [ "dotnet", "SkiShop.API.dll" ]