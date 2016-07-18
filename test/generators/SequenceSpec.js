

import '../test-helper/testUtils';
import Sequence from '../../src/generators/Sequence';
import { expect } from 'chai';
import asyncFunction from '../test-helper/asyncFunction';
import sinon from 'sinon';

describe('Sequence', function () {
  describe('#constructor', function () {
    it('can be created', function () {
      const sequence = new Sequence({});
      expect(sequence).to.be.instanceof(Sequence);
    });
  });

  describe('#generate', function () {
    it('generates an id if not provided', function () {
      const sequence = new Sequence({});
      sequence.generate();
      expect(sequence.id).to.exist;
      expect(Sequence.sequences[sequence.id]).to.equal(2);
    });

    it('initialises the sequence for id', function () {
      expect(Sequence.sequences['some.id.1']).to.not.exist;
      const sequence = new Sequence({});
      sequence.generate('some.id.1');
      expect(Sequence.sequences['some.id.1']).to.exist;
      expect(Sequence.sequences['some.id.1']).to.be.equal(2);
    });

    it('does not reset the sequence for id', function () {
      expect(Sequence.sequences['some.id.2']).to.not.exist;
      Sequence.sequences['some.id.2'] = 2;
      const sequence = new Sequence({});
      sequence.generate('some.id.2');
      expect(Sequence.sequences['some.id.2']).to.exist;
      expect(Sequence.sequences['some.id.2']).to.be.equal(3);
    });

    it('generates numbers sequentially', asyncFunction(async function () {
      const sequence = new Sequence({});
      const seq1 = await sequence.generate();
      const seq2 = await sequence.generate();
      const seq3 = await sequence.generate();
      expect(seq2 - seq1).to.be.equal(1);
      expect(seq3 - seq2).to.be.equal(1);
    }));

    it('generates numbers sequentially and calls callback',
      asyncFunction(async function () {
        const callback = sinon.spy(function (n) {
          return `value${n}`;
        });
        const sequence = new Sequence({});
        const seq1 = await sequence.generate(callback);
        const seq2 = await sequence.generate(callback);
        expect(seq1).to.be.equal('value1');
        expect(seq2).to.be.equal('value2');
        expect(callback).to.be.calledTwice;
      })
    );
  });
});
