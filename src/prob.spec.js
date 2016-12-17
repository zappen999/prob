'use strict';
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

chai.should();
chai.use(require('chai-things'));

const handling = require('./prob');

describe('Prob', function() {
  describe('Prob prototype', function() {
    it('should set properties', function() {
      const p = new handling.Prob(
        'error',
        'some',
        { some: 'data' },
        400
      );

      expect(p.severity).to.equal('error');
      expect(p.message).to.equal('some');
      expect(p.data).to.deep.equal({ some: 'data' });
      expect(p.status).to.equal(400);
      expect(p.stack).to.contain('prob.spec.js');
    });

    it('should throw if passing an invalid severity', function() {
      expect(function() {
        new handling.Prob('some'); // eslint-disable-line
      }).to.throw('Invalid severity');
    });
  });

  describe('Handle', function() {
    afterEach(function() {
      handling.setHandler(() => {});
    });

    it('should not call handler if next doesnt throw', async function() {
      const nextStub = sinon.stub();
      const handlerStub = sinon.stub();

      nextStub.returns(Promise.resolve());
      handling.setHandler(handlerStub);
      await handling.handle({}, nextStub);
      expect(nextStub.callCount).to.equal(1);
      expect(handlerStub.callCount).to.equal(0);
    });

    it(
      'should call the handler if next middleware throws a Prob',
      async function() {
        const nextStub = sinon.stub();
        const handlerStub = sinon.stub();

        nextStub.returns(Promise.reject(new handling.Prob('error', 'some')));
        handling.setHandler(handlerStub);
        await handling.handle({}, nextStub);
        expect(nextStub.callCount).to.equal(1);
        expect(handlerStub.callCount).to.equal(1);
      }
    );

    it('should rethrow the error if it wasn´t a Prob', async function() {
      const nextStub = sinon.stub();
      const handlerStub = sinon.stub();

      nextStub.returns(Promise.reject(new Error('error')));
      handling.setHandler(handlerStub);

      try {
        await handling.handle({}, nextStub);
      } catch (err) {
        expect(err instanceof Error).to.equal(true);
        expect(err.message).to.equal('error');
      }
    });
  });
});
