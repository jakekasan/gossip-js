# Gossip-JS

### A distributed consensus protocol.

This is a simple Node-JS implementation of the gossip protocol. At the moment, members randomly generate words and append them to their "information" with a small chance of them selecting from a "bad words" list. Members then regularly scan a range of ports for other members while also broadcasting their own information whenever they add new elements. A member can either randomly scan the ports, or ask an existing known member (if it has any) for one of their members. Once the member knows of any other members, it will compare its list with that of the other members. If at any point a bad word is found in the list, the list is spoiled and is no longer considered valid. When multiple lists valid lists are found, the longest one is considered the valid one.

_To Do_:

- [ ] Add a voting mechanism, so that if more than one valid list of the same length is discovered, members can vote of which one they consider valid.
- [ ] Add a "non-local" mode, where a set list of public addresses can be specified when a member is created, and then have a mechanism where new members sign up through an existing member.
