#!/usr/bin/env bash
set -e
ng build --configuration production
cd dist
aws s3 cp . s3://quickentry.mastersswimmingqld.org.au --recursive
#aws cloudfront create-invalidation --distribution-id xxxxxx --paths "/*"
