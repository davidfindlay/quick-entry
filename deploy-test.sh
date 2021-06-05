#!/usr/bin/env bash
set -e
ng build --configuration test
cd dist
aws s3 cp . s3://test.quickentry.mastersswimmingqld.org.au --recursive
#aws cloudfront create-invalidation --distribution-id xxxxxx --paths "/*"
