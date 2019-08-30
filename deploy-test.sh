#!/usr/bin/env bash

ng build --configuration test
cd dist
~/Library/Python/3.7/bin/aws s3 cp . s3://test.quickentry.mastersswimmingqld.org.au --recursive
#aws cloudfront create-invalidation --distribution-id xxxxxx --paths "/*"
