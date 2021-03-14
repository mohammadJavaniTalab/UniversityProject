#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:2.1-stretch-slim AS base
WORKDIR /app
EXPOSE 6004

FROM mcr.microsoft.com/dotnet/core/sdk:2.1-stretch AS build
WORKDIR /src
COPY ["ERP.CoreService.Api/ERP.CoreService.Api.csproj", "ERP.CoreService.Api/"]
COPY ["ERP.CoreService.Business/ERP.CoreService.Business.csproj", "ERP.CoreService.Business/"]
COPY ["ERP.CoreService.DataAccess/ERP.CoreService.DataAccess.csproj", "ERP.CoreService.DataAccess/"]
COPY ["ERP.CoreService.DataAccess.Generator/ERP.CoreService.DataAccess.Generator.csproj", "ERP.CoreService.DataAccess.Generator/"]
COPY ["ERP.CoreService.Core/ERP.CoreService.Core.csproj", "ERP.CoreService.Core/"]
COPY ["ERP.CoreService.ApiClient/ERP.CoreService.ApiClient.csproj", "ERP.CoreService.ApiClient/"]
RUN dotnet restore "ERP.CoreService.Api/ERP.CoreService.Api.csproj"
COPY . .
WORKDIR "/src/ERP.CoreService.Api"
RUN dotnet build "ERP.CoreService.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ERP.CoreService.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ERP.CoreService.Api.dll"]