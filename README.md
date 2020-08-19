# apiMockService
This is a service to mockout certain call, mostly to be used on front end development for easy use and defining responses in a json format

## Some technical stuffs
* apiMockService was written in node for easy start and stop
* To use just clone to your pc and navigate to folder and use the following command
`node mockServer.js`
* Also remember to checkout the 'config.json' for 'portNumber' and 'responseFile' to be set, which ever you want to use

### Setup responses
In my file called 'responses.json' I defined a few objects for testing purposes.
There is a few things  you need to keep in mind using this tool and I will explain.

Lets say you want to mock out a call that looks something like the following.
* Request method is in this case a `POST`
* url: `http://localhost:8080/funeral`
* and you have a body of a json like: 
```
{
    "clientName":"johnny"
}
```

what my code does is it creates a key from all this information to go look at in the json object of responses, The key would look typically like this: `POST_funeral_clientName_johnny`.
You need to define the response in your responses.json like follow `key` and `object`:
```
{
    "POST_funeral_clientName_johnny": {
        "name": "Johnny",
        "surname": "hendriks"
    }
}
```
