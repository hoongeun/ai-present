terraform {
  required_version = "~> 1.0.11"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket = "hoongeun.com-terraform"
    key    = "side-project/ai-present/terraform.tfstate"
    region = "ap-northeast-2"
  }
}

provider "aws" {
  region = "ap-northeast-2"
}

provider "aws" {
  alias  = "acm_provider"
  region = "ap-northeast-2"
}
