#!/bin/bash
# Start scrapyd in background
scrapyd &

# Wait for scrapyd to be ready
sleep 3

# Deploy spiders to scrapyd
scrapyd-deploy

# Bring scrapyd back to foreground
wait
